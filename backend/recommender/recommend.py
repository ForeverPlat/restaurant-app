from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer, util
import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
csv_path = os.path.join(BASE_DIR, "data", "restaurants.csv")

df = pd.read_csv(csv_path)

df["tags"] = (
    (df["cuisine"].str.lower() + " ") +
    (df["price_range"].str.replace("$", "dollar ")) +
    (df["tags"].str.replace(",", " ").str.lower())
)

df["description"] = df["description"].str.lower()

# ----------------------------------------------------
# => SEMANTIC EMBEDDINGS (meaning from descriptions)
# ----------------------------------------------------
model = SentenceTransformer("all-MiniLM-L6-v2")

# convert all restaurant tags into semantic vectors
desc_embeddings = model.encode(df["description"].tolist(), convert_to_tensor=True) 

# similarity matrix (restaurant ↔ restaurant by meaning)
semantic_matrix = util.pytorch_cos_sim(desc_embeddings, desc_embeddings)
semantic_matrix = util.pytorch_cos_sim(desc_embeddings, desc_embeddings)
semantic_np = semantic_matrix.cpu().numpy()

# ----------------------------------------------------
# => TAG SIMILARITY (exact keyword overlap)
# ----------------------------------------------------
tag_vectorizer = CountVectorizer()
tag_matrix = tag_vectorizer.fit_transform(df["tags"])

# similarity between restaurants based on keyword overlap
tag_sim_matrix = cosine_similarity(tag_matrix, tag_matrix)

# ----------------------------------------------------
# => HYBRID SIMILARITY MATRIX
# => final score = α * semantic + β * tag
# => tune α and β to match your style
# ----------------------------------------------------
alpha = 0.75   # semantic meaning importance
beta  = 0.25   # tag equality importance

hybrid_matrix = alpha * semantic_np + beta * tag_sim_matrix


def recommend_by_restaurant(restaurant, top_n=5):
    print("rec by rest")

    restaurants = df[df["name"].str.contains(restaurant["name"], regex=True)].index

    if restaurants.empty:
        return recommend_by_description(restaurant)
        # return recommend_by_tags(restaurant["tags"])

    index = restaurants[0]

    sim_scores = hybrid_matrix[index] # compute the similarity between this restaurant and all the others

    top_results = sim_scores.argsort()[::-1] # top 5 scores (first is itself)

    results = []
    for indx in top_results:
        # indx = indx.item() # convert to int
        if indx != index: # skip itself
            results.append(df.iloc[indx].to_dict())
        if len(results) == top_n:
            break

    print("rec by rest end")
    return results

def recommend_by_description(restaurant, top_n=5):
    print("rec by desc: " + restaurant["description"])

    description = restaurant["description"].lower()
    tags = restaurant["tags"].replace(",", " ").lower().strip()

    dVec_sem = model.encode(description, convert_to_tensor=True)
    sem_sim_scores = util.pytorch_cos_sim(dVec_sem, desc_embeddings)[0].cpu().numpy()

    dVec_tag = tag_vectorizer.transform([tags])
    tag_sim_scores = cosine_similarity(dVec_tag, tag_matrix)[0]

    hybrid_scores = alpha * sem_sim_scores + beta * tag_sim_scores

    top_results = hybrid_scores.argsort()[::-1][:top_n]
    
    # seems to be backwords and doesnt send only top 5
    return [df.iloc[i].to_dict() for i in top_results]


def recommend_by_tags(tags, top_n=5):
    print("rec by tag: " + tags)

    tags = restaurant["tags"].replace(",", " ").lower().strip()

    tVec_sem = model.encode(tags, convert_to_tensor=True)
    sem_sim_scores = util.pytorch_cos_sim(tVec_sem, desc_embeddings)[0].cpu().numpy()

    tVec_tag = tag_vectorizer.transform([tags])
    tag_sim_scores = cosine_similarity(tVec_tag, tag_matrix)[0]

    hybrid_scores = alpha * sem_sim_scores + beta * tag_sim_scores
    top_results = hybrid_scores.argsort()[::-1][:top_n]

    return [df.iloc[i].to_dict() for i in top_results]


restaurant = {
    # "name": "West Gate Social",
    "name": "Sakura Sushi",
    "cuisine": "Fast Food",
    "price_range": "$",
    "rating": "4.0",
    "tags": "burgers, perogies, fries, fast food, student",
    "description": "Campus-adjacent grease haven slinging juicy smash burgers and golden fries alongside Alberta-style cheddar-perogie poutines that drip with gravy. Cheap combo meals and $5 milkshakes keep university students fueled through late-night cram sessions."
}

# print(recommend_by_restaurant(restaurant))
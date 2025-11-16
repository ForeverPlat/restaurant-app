from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer, util
import pandas as pd

df = pd.read_csv("../data/restaurants.csv")

# add a description that most of the recs will be based off
# now using sentence transformer that would make more sense
df["tags"] = (
    (df["cuisine"].str.lower() + " ") * 2 + # moderate weight
    (df["price_range"].str.replace("$", "dollar ")) + # light weight
    (df["tags"].str.replace(",", " ").str.lower()) * 2 # moderate weight
)

model = SentenceTransformer("all-MiniLM-L6-v2")

# convert all restaurant tags into semantic vectors
# this is the matrix
embeddings = model.encode(df["tags"].tolist(), convert_to_tensor=True) 

def recommend_by_restaurant(restaurant, top_n=5):
    print("rec by rest")

    restaurants = df[df["name"].str.contains(restaurant["name"], regex=True)].index

    if restaurants.empty:
        # return recommend_by_description(restaurant["description"])
        return recommend_by_tags(restaurant["tags"])

    index = restaurants[0]
    ref_embedding = embeddings[index] # get the embedding of restaurants[0]

    # model.similarity() is newer version
    sim_scores = util.pytorch_cos_sim(ref_embedding, embeddings)[0] # compute the similarity between this restaurant and all the others

    top_results = sim_scores.topk(top_n + 1) # top 5 scores (first is itself)

    results = []
    for score, indx in zip(top_results.values, top_results.indices):
        indx = indx.item() # convert to int

        if indx != index: # skip itself
            results.append(df.iloc[indx]["name"])
        if len(results) == top_n:
            break

    print("rec by rest end")
    return results

def recommend_by_description(description, top_n=5):
    print("rec by desc: " + description)

    description = description.lower()

    dVec = model.encode(description, convert_to_tensor=True)

    sim_scores = util.pytorch_cos_sim(dVec, embeddings)[0]

    top_results = sim_scores.topk(top_n)
    
    matches = []

    # return [df.iloc[i.item()]["name"] for i in top_results.indices]

    for score, indx in zip(top_results.values, top_results.indices):
        indx = indx.item()

        matches.append(df.iloc[indx]["name"])
    
    return matches


def recommend_by_tags(tags, top_n=5):
    print("rec by tag: " + tags)

    tags = tags.replace(",", " ").lower()

    tVec = model.encode(tags, convert_to_tensor=True)

    sim_scores = util.pytorch_cos_sim(tVec, embeddings)[0]

    top_results = sim_scores.topk(top_n)

    matches = []

    for score, indx in zip(top_results.values, top_results.indices):
        indx = indx.item() # convert to int

        matches.append(df.iloc[indx]["name"])

    return matches

restaurant = {
    "name": "West Gate Social",
    # "name": "Sakura Sushi",
    "cuisine": "Fast Food",
    "price_range": "$",
    "rating": "4.0",
    "tags": "burgers, perogies, fries, fast food, student",
    "description": "Campus-adjacent grease haven slinging juicy smash burgers and golden fries alongside Alberta-style cheddar-perogie poutines that drip with gravy. Cheap combo meals and $5 milkshakes keep university students fueled through late-night cram sessions."
}

print(recommend_by_restaurant(restaurant))
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd

# => creates a df (data frame (a table of the csv))
df = pd.read_csv("../data/restaurants.csv")
df["tags"] = (
    (df["cuisine"].str.lower() + " ") * 2 + # moderate weight
    (df["price_range"].str.replace("$", "dollar ")) + # light weight
    (df["tags"].str.replace(",", " ").str.lower()) * 3 # strong weight
)

print(df["tags"])

# print(df)

# => transforms text into numerical vectors
# => downweights common words (like “the”, “food”) and upweights unique ones (like “spicy”, “romantic”)
# tfidf = TfidfVectorizer(stop_words="english")
# tfidf_matrix = tfidf.fit_transform(df["tags"])

vectorizer = CountVectorizer()
count_matrix = vectorizer.fit_transform(df["tags"])

# print(tfidf_matrix)

# => the cosine similarity between all the items
# => 1.0 means identical tag vectors; 0.0 means totally different
# similarity = cosine_similarity(tfidf_matrix)
similarity = cosine_similarity(count_matrix)

print(similarity[3])

# => inner df["name"] == "Sakura Sushi" picks up all the names in the df that are Sakura Sushi
# => then the outer df makes gives you a mini DataFrame with just that restaurant
# => then index 0 takes the first index of that dataframe (the id)
index = df[df["name"] == "Sakura Sushi"].index[0]

# print(index)

# => Get all similarity scores
scores = list(enumerate(similarity[index]))

# => sorts the similarity scores in order (first one will be itself)
scores = sorted(scores, key=lambda x: x[1], reverse=True)

# print(scores)

# => making a list with elements a position 1, 2, 3
# => we can look at those position of scores because it is sorted 
# => (the tuple has the indexes and we can use that to grab from the dataframe)

top = [df.iloc[i[0]].name for i in scores[1:4]]

print(top)


for i in top:
    print(df["name"][i])


# # 1. Check your processed tags
# print(df["tags"])

# # 2. See how many unique words exist
# print(len(tfidf.get_feature_names_out()))

# # 3. Check non-zero counts per restaurant
# print((tfidf_matrix != 0).sum(axis=1))
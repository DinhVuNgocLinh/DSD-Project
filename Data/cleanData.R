library(dplyr)
setwd("C:/Users/PC/OneDrive - VietNam National University - HCM INTERNATIONAL UNIVERSITY/Desktop")
data <- read.csv("googleplaystore_cleaned(1).csv")


# here some error is that 1 is "Unrated" in the data 
# so i decided to delete 2 of them to clear data

# Remove rows where Content_Rating is "Unrated"
data_clean <- data %>%
  filter(Content_Rating != "Unrated")

# Check unique ratings
unique_ratings <- unique(data_clean$Content_Rating)
print(unique_ratings)

# Group and summarize ratings
rating_counts <- table(data_clean$Content_Rating)
print(rating_counts)


#and 360 is "Everyone 10" is mean above 10 years old so i decided to change it to Above 10

# Modify Content_Rating column
data_clean$Content_Rating <- ifelse(data_clean$Content_Rating == "Everyone 10", "Above 10", data_clean$Content_Rating)

# Check unique ratings
unique_ratings <- unique(data_clean$Content_Rating)
print(unique_ratings)

# Group and summarize ratings
rating_counts <- table(data_clean$Content_Rating)
print(rating_counts)

# Remove the 'X' column if it exists
data_clean <- data_clean %>%
  select(-X)

# Check unique ratings
unique_ratings <- unique(data_clean$Content_Rating)
print(unique_ratings)

# Group and summarize ratings
rating_counts <- table(data_clean$Content_Rating)
print(rating_counts)

# Summary of the cleaned data
summary(data_clean)

write.csv(data_clean, file = "new_data_DSDV.csv", row.names = FALSE)

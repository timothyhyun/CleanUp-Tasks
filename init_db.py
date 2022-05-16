import sqlite3

#Create Database file
connection = sqlite3.connect('database.db')


#Run SQL script that creates the tables
with open('initialize.sql') as f:
    connection.executescript(f.read())


cursor = connection.cursor()

connection.commit()
connection.close()
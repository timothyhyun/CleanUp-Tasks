# CleanUp-Tasks

This is a collaborative Human-AI game where the user and an AI partner work to move items into its respective sinks. 
All Game Data is stored locally on a sqlite database. 


## Setup:

Ensure Python 3.6+ is installed on the device. 

Clone and Navigate to the Repository

```bash
pip install -r requirements.txt
```

To clear all Game Data, Delete the file ```database.db```



## Execution: 
1. Initialize the Database: (You only need to run this once). After running this file, the file ```database.db``` should be created. 
```bash 
py init_db.py
```
 

2. Start the web server, 
```bash 
py main.py
```

Go to http://localhost:5000

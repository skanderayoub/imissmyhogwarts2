import os
import json

path = "./assets/Player (Female)/"

# Saves paths to json file
def savePaths():
    paths = []
    for root, dirs, files in os.walk(os.getcwd() + path):
        for file in files:
            paths.append(os.path.join(path, file))
    with open('paths.json', 'w') as f:
        json.dump(paths, f)

savePaths()
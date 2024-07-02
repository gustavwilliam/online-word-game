with open("./public/wordlist/english.txt", "r+") as f:
    lines = f.read()
    f.seek(0)
    f.write(lines.lower())

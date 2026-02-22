import json
import re

md_path = "/Users/musfiqurtuhin/Downloads/Extrajudicial Killing/List of Victims of Extrajudicial Killings (Edit).md"
json_path = "/Users/musfiqurtuhin/Downloads/Extrajudicial Killing/victims.json"

with open(md_path, "r") as f:
    md_content = f.read()

with open(json_path, "r") as f:
    victims = json.load(f)

# Split by matching "**Serial [number]:"
# The text content starts immediately after.
sections = re.split(r'\*\*Serial\s+\d+.*?\*\*', md_content)

for i, v in enumerate(victims):
    # section 0 is before the first Serial match
    if i + 1 < len(sections):
        text = sections[i + 1].strip()
        # Clean up text
        # If text is too short, skip
        if len(text) > 10:
            # We want to append this text to the details
            # If not already appended
            if "গোপালগঞ্জে ডেভিল হান্টে" not in v["details"] and text not in v["details"]:
                v["details"] = v["details"] + "\n\n" + text

with open(json_path, "w") as f:
    json.dump(victims, f, ensure_ascii=False, indent=2)

print("Updated victims.json with full body texts!")

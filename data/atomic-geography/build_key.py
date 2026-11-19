import json, unicodedata, re, sys
ELS = """H Hydrogen;He Helium;Li Lithium;Be Beryllium;B Boron;C Carbon;N Nitrogen;O Oxygen;F Fluorine;Ne Neon;Na Sodium;Mg Magnesium;Al Aluminum|Aluminium;Si Silicon;P Phosphorus;S Sulfur|Sulphur;Cl Chlorine;Ar Argon;K Potassium;Ca Calcium;Sc Scandium;Ti Titanium;V Vanadium;Cr Chromium;Mn Manganese;Fe Iron;Co Cobalt;Ni Nickel;Cu Copper;Zn Zinc;Ga Gallium;Ge Germanium;As Arsenic;Se Selenium;Br Bromine;Kr Krypton;Rb Rubidium;Sr Strontium;Y Yttrium;Zr Zirconium;Nb Niobium;Mo Molybdenum;Tc Technetium;Ru Ruthenium;Rh Rhodium;Pd Palladium;Ag Silver;Cd Cadmium;In Indium;Sn Tin;Sb Antimony;Te Tellurium;I Iodine;Xe Xenon;Cs Cesium|Caesium;Ba Barium;La Lanthanum;Ce Cerium;Pr Praseodymium;Nd Neodymium;Pm Promethium;Sm Samarium;Eu Europium;Gd Gadolinium;Tb Terbium;Dy Dysprosium;Ho Holmium;Er Erbium;Tm Thulium;Yb Ytterbium;Lu Lutetium;Hf Hafnium;Ta Tantalum;W Tungsten;Re Rhenium;Os Osmium;Ir Iridium;Pt Platinum;Au Gold;Hg Mercury;Tl Thallium;Pb Lead;Bi Bismuth;Po Polonium;At Astatine;Rn Radon;Fr Francium;Ra Radium;Ac Actinium;Th Thorium;Pa Protactinium;U Uranium;Np Neptunium;Pu Plutonium;Am Americium;Cm Curium;Bk Berkelium;Cf Californium;Es Einsteinium;Fm Fermium;Md Mendelevium;No Nobelium;Lr Lawrencium;Rf Rutherfordium;Db Dubnium;Sg Seaborgium;Bh Bohrium;Hs Hassium;Mt Meitnerium;Ds Darmstadtium;Rg Roentgenium;Cn Copernicium;Nh Nihonium;Fl Flerovium;Mc Moscovium;Lv Livermorium;Ts Tennessine;Og Oganesson"""
def norm(s):
    s = unicodedata.normalize("NFD", s.lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = s.replace("&", " and ")
    s = re.sub(r"['’‘`.]", "", s)
    s = re.sub(r"[^a-z]+", " ", s).strip()
    s = re.sub(r"^the ", "", s)
    s = re.sub(r"^st ", "saint ", s)
    return s
els = []
for i, e in enumerate(ELS.split(";")):
    sym, names = e.split(" ", 1)
    els.append({"n": i + 1, "s": sym, "names": [norm(x) for x in names.split("|")], "show": names.split("|")[0]})
assert len(els) == 118
places = {}  # norm text -> list of entity ids
ents = []
for line in open(sys.argv[1]):
    line = line.strip()
    if not line or line.startswith("#"): continue
    parts = [p.strip() for p in line.split(";")]
    cname = parts[0].split("|")[0].strip()
    for k, p in enumerate(parts):
        vs = [v.strip() for v in p.split("|")]
        eid = len(ents)
        ents.append(("country" if k == 0 else "capital") + ":" + (vs[0] if k else cname))
        for v in vs:
            places.setdefault(norm(v), []).append(eid)
countries = sum(1 for e in ents if e.startswith("country"))
print("countries", countries, "entities", len(ents), "names", len(places), file=sys.stderr)
# feasibility
for e in els:
    m = [p for p in places if all(c in p.replace(" ", "") for c in e["s"].lower())]
    if len(m) < 3: print(e["s"], m, file=sys.stderr)
json.dump({"els": [[e["s"], e["names"]] for e in els], "places": places, "ents": ents}, open(sys.argv[2], "w"), separators=(",", ":"))

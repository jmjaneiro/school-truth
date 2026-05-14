from pyproj import Transformer

x, y = -10430.1102877764, 153994.318023966

t1 = Transformer.from_crs("EPSG:3763", "EPSG:4326", always_xy=True)
print("If 3763:  ", t1.transform(x, y))

t2 = Transformer.from_crs("EPSG:27493", "EPSG:4326", always_xy=True)
print("If 27493: ", t2.transform(x, y))

t3 = Transformer.from_crs("EPSG:20790", "EPSG:4326", always_xy=True)
print("If 20790: ", t3.transform(x, y))


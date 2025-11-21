import { readCSVFile, writeCSVFile } from "../../src/utils/csvParser";
import { promises as fs } from "fs";

jest.mock("fs", () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
}));

const mockCsvData = `"id","Type","Flavor","Filling","Size","Layers","Frosting Type","Frosting Flavor","Decoration Type","Decoration Color","Custom Message","Shape","Allergies","Special Ingredients","Packaging Type","Price","Quantity"
"0","Sponge","Vanilla","Cream","20","2","Buttercream","Vanilla","Sprinkles","Multi-color","Happy Birthday","Round","Nut-Free","Organic Ingredients","Standard Box","50","1"
"1","Chocolate","Chocolate","Ganache","25","3","Fondant","Chocolate","Fondant Figures","Red","Congrats","Square","Gluten-Free","Vegan","Luxury Box with Ribbon","75","2"
"2","Fruit","Lemon","Jam","15","1","Whipped Cream","Lemon","Edible Flowers","Yellow","","Heart-Shaped","None","Sugar-Free","Standard Box","40","1"
"3","Red Velvet","Red Velvet","Cream Cheese","30","4","Buttercream","Vanilla","Edible Glitter","Gold","Happy Anniversary","Round","Dairy-Free","Vegan","Luxury Box","90","1"
`;

describe("CSV Utils with mocks", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("readCSVFile returns parsed CSV data including header", async () => {
    (fs.readFile as jest.Mock).mockResolvedValue(mockCsvData);

    const result = await readCSVFile("dummy.csv", true);
    expect(result.length).toBe(5); // header + 4 rows
    expect(result[0][1]).toBe("Type");
    expect(result[1][1]).toBe("Sponge");
  });

  test("readCSVFile skips header if includeHeader=false", async () => {
    (fs.readFile as jest.Mock).mockResolvedValue(mockCsvData);

    const result = await readCSVFile("dummy.csv", false);
    expect(result.length).toBe(4); // only data rows
    expect(result[0][1]).toBe("Sponge"); // first row is data
  });

  test("writeCSVFile calls fs.writeFile with stringified data", async () => {
    (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

    const data = [
      ["id", "Type", "Flavor"],
      ["0", "Sponge", "Vanilla"],
    ];

    await writeCSVFile("dummy.csv", data);
    expect(fs.writeFile).toHaveBeenCalledWith(
      "dummy.csv",
      expect.stringContaining("Sponge"),
      "utf-8"
    );
  });

  test("readCSVFile throws on read error", async () => {
    (fs.readFile as jest.Mock).mockRejectedValue(new Error("file not found"));

    await expect(readCSVFile("dummy.csv")).rejects.toThrow("Error reading CSV file");
  });

  test("writeCSVFile throws on write error", async () => {
    (fs.writeFile as jest.Mock).mockRejectedValue(new Error("permission denied"));

    await expect(writeCSVFile("dummy.csv", [])).rejects.toThrow("Error writing CSV file");
  });
});

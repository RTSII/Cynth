interface DataItem {
  id: number;
  name: string;
}

export async function fetchData(): Promise<DataItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
        { id: 3, name: "Item 3" },
      ]);
    }, 500);
  });
}
export interface StockItem {
    productId: number;
    name: string;
    productCode: string;
    description: string;
    amount: number;
    currency: string;
    walletTypeId: number;
  }
  
  export async function fetchStockAmounts(productId: number): Promise<number[]> {
    const res = await fetch(`http://localhost:8080/api/check-stock/${productId}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch stock for ${productId}: HTTP ${res.status}`);
    }
    const data: { stock: StockItem[] } = await res.json();
    return data.stock.map(item => item.amount);
  }
  
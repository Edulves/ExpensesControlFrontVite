// Ícones (Material Symbols) por transactionCategoryId.
// A associação é feita pelo Id para que renomear a categoria na API não altere o ícone.
export const categoryIcons: Record<number, string> = {
    1: "restaurant", // Alimentação fora de casa
    2: "shopping_cart", // Mercado e supermercado
    3: "local_taxi", // Transporte por aplicativo
    4: "medication", // Farmácia e medicamentos
    5: "celebration", // Lazer e entretenimento
    6: "spa", // Cuidados pessoais
    7: "receipt_long", // Despesas diversas
    8: "bakery_dining", // Padaria e panificados
    9: "credit_card", // Antecipação de fatura
    10: "school", // Educação e cursos
    11: "credit_score", // Fatura do cartão de crédito
    12: "medical_services", // Saúde e despesas médicas
    13: "subscriptions", // Assinaturas e serviços digitais
    14: "trending_up", // Investimentos
    15: "home", // Moradia e habitação
    16: "car_repair", // Veículo e manutenção
    17: "sports_esports", // Jogos e games
    18: "dentistry", // Odontologia
    20: "bolt", // Contas domésticas
    21: "checkroom", // Vestuário e acessórios
    22: "local_gas_station", // Combustível
    23: "account_balance", // Impostos e taxas
    24: "redeem", // Presentes e doações
    25: "shield", // Seguros
    26: "pets", // Animais de estimação
    27: "flight", // Viagens
};

export const fallbackCategoryIcon = "category";

export function iconForCategory(transactionCategoryId?: number): string {
    return (transactionCategoryId !== undefined && categoryIcons[transactionCategoryId]) || fallbackCategoryIcon;
}

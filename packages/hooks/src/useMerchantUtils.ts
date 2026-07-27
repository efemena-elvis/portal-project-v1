import { defineStore } from "pinia";

interface Business {
  business_name: string;
  mcc: string;
  email: string;
  phone_number: string;
  website_link: string;
}

interface BusinessAddress {
  address: string;
  billing_descriptor_1: string;
  country_id: string;
  billing_descriptor_2: string;
}

interface Representative {
  id: number;
  address: string;
  directors_id?: string;
  full_name: string;
  country_id: string;
  business_role?: string[];
}

interface Document {
  id: number;
  type: string;
  url: string;
  tin_number: string;
}

interface TableRow {
  [key: string]: any;
}

export const useMerchantUtils = defineStore("merchant", {
  state: () => ({
    business: [] as Business[],
    businessAddress: [] as BusinessAddress[],
    representative: [] as Representative[],
    documents: [] as Document[],
    merchantTable: [] as TableRow[],
  }),

  actions: {
    setBusinessProfile(profile: Business | Business[]) {
      this.business = Array.isArray(profile) ? profile : [profile];
    },

    setBusinessAddress(addresses: BusinessAddress[]) {
      this.businessAddress = addresses;
    },

    addRepresentatives(representatives: Representative[]) {
      this.representative = [...this.representative, ...representatives];
    },

    updateRepresentatives(id: number, data: Partial<Representative>) {
      const index = this.representative.findIndex((rep) => rep.id === id);
      if (index !== -1) {
        this.representative[index] = { ...this.representative[index], ...data };
      }
    },

    deleteRepresentatives(id: number) {
      this.representative = this.representative.filter((rep) => rep.id !== id);
    },

    setBusinessDocuments(docs: Document[]) {
      this.documents = [...this.documents, ...docs];
    },

    setMerchantTable(data: TableRow[]) {
      this.merchantTable = data;
    },

    addRow(row: TableRow) {
      this.merchantTable.push(row);
    },

    updateRow(id: number, data: Partial<TableRow>) {
      const index = this.merchantTable.findIndex((row) => row.id === id);
      if (index !== -1) {
        this.merchantTable[index] = { ...this.merchantTable[index], ...data };
      }
    },

    deleteRow(id: number) {
      this.merchantTable = this.merchantTable.filter((row) => row.id !== id);
    },

    getFullPayload() {
      const merchantCount = this.business.length;

      const payload = Array.from({ length: merchantCount }, (_, idx) => {
        const merchantId = idx + 1;

        return {
          businessProfile: this.business[idx] || {},
          businessAddress: this.businessAddress[idx] || {},
          representatives: this.representative.filter(
            (rep) => rep.id === merchantId,
          ),
          documents: this.documents.filter((doc) => doc.id === merchantId),
          merchantTable: this.merchantTable[idx] || {},
        };
      });

      return payload;
    },
  },
});

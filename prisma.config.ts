
export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});

function defineConfig(arg0: { datasource: { url: string; }; }) {
    throw new Error("Function not implemented.");
}

import { makeLearnDetail } from "@/components/LearnDetail";

const { generateStaticParams, generateMetadata, Page } = makeLearnDetail("tutorial");

export { generateStaticParams, generateMetadata };
export default Page;

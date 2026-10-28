import { makeLearnDetail } from "@/components/LearnDetail";

const { generateStaticParams, generateMetadata, Page } = makeLearnDetail("course");

export { generateStaticParams, generateMetadata };
export default Page;

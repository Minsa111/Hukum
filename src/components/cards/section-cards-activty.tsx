import {
  Card,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

interface SectionCardProps {
  title: string;
}
export function SectionCard({title, children }:SectionCardProps & {children: React.ReactNode}) {
  return (
    <Card className="flex flex-col justify-center items-center md:items-start m-0 pl-4 pr-8 gap-1 py-2 ">
      <CardTitle className="text-xs text-gray-500 font-medium">
        {title}
      </CardTitle>
      <CardDescription className="text-xs md:text-sm lg:text-md font-semibold text-black">
        {children}
      </CardDescription>
    </Card>
  );
}

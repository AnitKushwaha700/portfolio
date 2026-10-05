import MotionWrapper from "./MotionWrapper";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeading({
  title,
  subtitle,
}: SectionHeadingProps) {
  return (
    <MotionWrapper className="mb-12 text-center md:mb-16">
      <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-2xl text-base text-text-secondary sm:text-lg">
          {subtitle}
        </p>
      )}
    </MotionWrapper>
  );
}

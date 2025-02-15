import Register from "@/components/auth/register";
import FadeIn from "@/components/fadin";

export default function Home() {
  return (
    <>
      <FadeIn>
        <Register />
      </FadeIn>
    </>
  );
}
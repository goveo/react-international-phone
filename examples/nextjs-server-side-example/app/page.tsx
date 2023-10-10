import { PhoneInputForm } from '@/components/PhoneInputForm';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-2xl font-bold">Next.js Example</h1>
      <h2 className="text-lg">Server Side Rendering</h2>
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[240px] after:w-[320px] after:-translate-x-32 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]" />

      <div className="my-8">
        <PhoneInputForm />
      </div>
    </main>
  );
}

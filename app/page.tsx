import{redirect} from 'next/navigation';
export default function Page() {
  redirect('/optimus_media/home');
  return null; // This line is never reached, but it's good practice to return something.
}
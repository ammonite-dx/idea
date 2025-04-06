export default function SubmitButton({ text }: { text: string }) {
    return (
        <button type="submit" className='w-full h-full font-black text-white dark:text-neutral-900 bg-neutral-900 dark:bg-neutral-200 py-1'>{text}</button>
    );
}
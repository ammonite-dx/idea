export default function SubmitButton({ text }: { text: string }) {
    return (
        <button type="submit" className='w-full button-dark font-bold py-1'>{text}</button>
    );
}
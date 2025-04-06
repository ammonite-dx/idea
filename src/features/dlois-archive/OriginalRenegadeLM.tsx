export default function OriginalRenegadeLM() {
  return (
    <table className="table-auto w-full border-collapse">
        <thead className="border-b border-neutral-900 dark:border-neutral-200">
            <tr>
                <th className="text-center py-1">侵蝕率</th>
                <th className="text-center py-1">エフェクトLV</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td className="text-center py-1">0～79</td>
                <td className="text-center py-1">±0</td>
            </tr>
            <tr>
                <td className="text-center py-1">80～99</td>
                <td className="text-center py-1">+1</td>
            </tr>
            <tr>
                <td className="text-center py-1">100～149</td>
                <td className="text-center py-1">+2</td>
            </tr>
            <tr>
                <td className="text-center py-1">150～199</td>
                <td className="text-center py-1">+3</td>
            </tr>
            <tr>
                <td className="text-center py-1">200～</td>
                <td className="text-center py-1">+4</td>
            </tr>
        </tbody>
    </table>
  );
}
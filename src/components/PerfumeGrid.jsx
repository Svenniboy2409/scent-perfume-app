import PerfumeCard from './PerfumeCard.jsx'

export default function PerfumeGrid({ perfumes }) {
  return (
    <div className="grid">
      {perfumes.map((perfume) => (
        <PerfumeCard key={perfume.id} perfume={perfume} />
      ))}
    </div>
  )
}

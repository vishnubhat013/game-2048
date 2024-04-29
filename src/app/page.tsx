import dynamic from 'next/dynamic'
 
const DynamicHeader = dynamic(() => import('../components/Board'), {
  loading: () => <p>Loading...</p>,
})
 
export default function Home() {
  return <DynamicHeader />
}
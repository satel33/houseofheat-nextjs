import Advertisement from '../Advertisement'
import Section from '../Section'

export default function AdvertisementSlice ({ data }) {
  if (data.adSize === 'tile') {
    return (
      <Section as='aside' grid noBottomMargin>
        <Advertisement data={data} className='col-span-full md:col-start-7 md:w-[400px]' />
      </Section>
    )
  } else {
    return (
      <Advertisement data={data} />
    )
  }
}

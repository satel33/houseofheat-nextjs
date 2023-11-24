import Section from '../Section'

export default function HtmlSlice ({ data }) {
  const { content } = data
  return (
    <Section grid>
      <div className='col-span-full md:col-start-7 md:col-end-12' dangerouslySetInnerHTML={ { __html: content.code } } />
    </Section>
  )
}

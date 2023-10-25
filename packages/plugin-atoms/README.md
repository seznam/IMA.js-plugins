# @ima/plugin-atoms

The [IMA](https://imajs.io) UI atoms are elementary UI components based on
the [Pattern Lab](http://patternlab.io/) design pattern for creating atomic design
systems.

This package provides various most commonly needed atoms, but both their functionality and
their number are likely to be extended in the future.

The Image, Iframe and others atoms provide the lazy loading functionality by default.

## Installation

```javascript

npm install @ima/plugin-atoms --save

```

## Usage

```javascript

import { H1, H2, H3, Iframe, Image, Link, Loader, Paragraph, LAYOUT } from '@ima/plugin-atoms';

function MyComponent({title, subtitle, image, embed, text, html, link}) {
  return (
    <>
      <H1>{title}</H1>
      <H2>{subtitle}</H2>
      <div>
        <Paragraph>{text}</Paragraph>
        <Paragraph html={html}/>
        <Link href={lnk.href}>More</Link>
      </div>
      <H3>Examples:<H3>
      <Image src={image.source} width={400} height={300} layout={LAYOUT.RESPONSIVE}/>
      <Iframe src={embed.source} width={300} height={300} layout={LAYOUT.RESPONSIVE}/>
    </>
  )
}
```
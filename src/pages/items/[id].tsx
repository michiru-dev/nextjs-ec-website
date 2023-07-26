import axios from 'axios'
import { ItemType } from '@/types/itemTypes'
import Image from 'next/image'
import Button from '@/components/Button'
import { useState } from 'react'
import Link from 'next/link'
import { useAppDispatch } from '@/redux/hooks'
import { addToCart } from '@/redux/slicers/cartSlice'

export async function getStaticPaths() {
  const allItems = await axios
    .get('https://fakestoreapi.com/products')
    .then((res) => res.data)

  const paths = allItems.map((item: ItemType) => {
    return { params: { id: `${item.id}` } }
  })

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }: { params: ItemType }) {
  const itemDetail = await axios
    .get(`https://fakestoreapi.com/products/${params.id}`)
    .then((res) => res.data)

  return {
    props: {
      itemDetail,
    },
  }
}

export default function Item({ itemDetail }: { itemDetail: ItemType }) {
  //何でここで型エラーが起きてない？
  const dispatch = useAppDispatch()
  const [quantity, setQuantity] = useState(1)

  const handleOnChange = (e: any) => {
    setQuantity(e.target.value)
  }

  const handleOnClick = () => {
    const item = { ...itemDetail, quantity }
    dispatch(addToCart(item))
    alert('カートに追加されました')
  }

  return (
    <div>
      <h2>{itemDetail.title}</h2>
      <p>{itemDetail.description}</p>
      <p>${itemDetail.price}</p>
      <p>{itemDetail.rating.rate}</p>
      <p>{itemDetail.rating.count}</p>
      <Image
        src={itemDetail.image}
        alt={itemDetail.title}
        width={200}
        height={300}
      />
      <input
        onChange={(e) => handleOnChange(e)}
        type='number'
        value={quantity}
      />
      <Button onClick={handleOnClick} text={'カートに追加'} />
      <Link href={'/cart'}>カートを確認/お会計に進む</Link>
    </div>
  )
}

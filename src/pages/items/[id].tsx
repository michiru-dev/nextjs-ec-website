import axios from 'axios'
import { ItemType } from '@/types/itemTypes'
import Image from 'next/image'
import Button from '@/components/Button'
import { useState } from 'react'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { addToCart } from '@/redux/slicers/cartSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { AiOutlineShoppingCart } from 'react-icons/ai'

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
  const cartItemsList = useAppSelector((state) => state.cart.items)
  const totalItemsQuantity = cartItemsList.reduce((sum, item) => {
    return sum + item.quantity
  }, 0)

  console.log(totalItemsQuantity)

  //何でここで型エラーが起きてない？
  const dispatch = useAppDispatch()
  const [quantity, setQuantity] = useState(1)

  const handleOnChange = (e: any) => {
    setQuantity(e.target.value)
  }

  const handleOnClick = () => {
    const item = { ...itemDetail, quantity: Number(quantity) }
    dispatch(addToCart(item))
    alert(`カートに${quantity}点追加されました`)
    setQuantity(0)
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
      <label htmlFor={`quantity-${itemDetail.id}`}>個数</label>
      <select
        name={`quantity-${itemDetail.id}`}
        id={`quantity-${itemDetail.id}`}
        onChange={(e) => handleOnChange(e)}
        value={quantity}
      >
        <option value='1'>1</option>
        <option value='2'>2</option>
        <option value='3'>3</option>
        <option value='4'>4</option>
        <option value='5'>5</option>
        <option value='6'>6</option>
        <option value='7'>7</option>
        <option value='8'>8</option>
        <option value='9'>9</option>
        <option value='10'>10</option>
      </select>
      <Button onClick={handleOnClick} text={'カートに追加'} />
      <Link href={'/'}>☜商品一覧へ戻る</Link>
      <Link href={'/cart'}>
        {/* <FontAwesomeIcon icon={faCartShopping} /> */}
        <AiOutlineShoppingCart />
        <p>{totalItemsQuantity}</p>
        カートを確認/お会計に進む
      </Link>
    </div>
  )
}

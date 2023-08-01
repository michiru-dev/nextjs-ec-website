import axios from 'axios'
import { ItemType } from '@/types/itemTypes'
import Image from 'next/image'
import Button from '@/components/Button'
import { useEffect, useState } from 'react'
import { useAppDispatch } from '@/redux/hooks'
import { addToCart } from '@/redux/slicers/cartSlice'
import Layout from '@/components/Layout'
import styles from '@/styles/[id].module.scss'
import StarRating from '@/components/StartRating'

export async function getStaticPaths() {
  try {
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
  } catch (error) {
    console.error('パス取得失敗:', error)
    return {
      paths: [],
      fallback: false,
    }
  }
}

export async function getStaticProps({ params }: { params: ItemType }) {
  try {
    const itemDetail = await axios
      .get(`https://fakestoreapi.com/products/${params.id}`)
      .then((res) => res.data)

    return {
      props: {
        itemDetail,
      },
    }
  } catch (error) {
    console.error('ページ取得失敗:', error)
    return {
      notFound: true,
    }
  }
}

export default function Item({ itemDetail }: { itemDetail: ItemType }) {
  //何でここで型エラーが起きてない？
  const dispatch = useAppDispatch()
  const [quantity, setQuantity] = useState(1)
  const [showAlert, setShowAlert] = useState(false)

  const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value))
  }

  const handleOnClick = () => {
    const item = { ...itemDetail, quantity: Number(quantity) }
    dispatch(addToCart(item))
    setQuantity(1)
    setShowAlert(true)
  }

  const quantityArr = Array.from({ length: 10 }, (_, i) => i + 1)

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false)
      }, 3000)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [showAlert])

  return (
    <Layout>
      <div className={styles.itemContainer}>
        <div className={styles.itemImage}>
          <Image
            src={itemDetail.image}
            alt={itemDetail.title}
            width={200}
            height={300}
          />
        </div>
        {showAlert && (
          <div className={styles.alert}>カートに商品が追加されました</div>
        )}
        <div className={styles.itemDetails}>
          <h2>{itemDetail.title}</h2>
          <StarRating rating={itemDetail.rating} />
          <p>{itemDetail.description}</p>
          <p className={styles.price}>${itemDetail.price}</p>

          <label htmlFor={`quantity-${itemDetail.id}`}>個数:</label>
          <select
            name={`quantity-${itemDetail.id}`}
            id={`quantity-${itemDetail.id}`}
            onChange={(e) => handleOnChange(e)}
            value={quantity}
          >
            {quantityArr.map((num) => {
              return (
                <option key={num} value={num}>
                  {num}
                </option>
              )
            })}
          </select>

          <Button
            className={styles.button}
            onClick={handleOnClick}
            text={'カートに追加'}
          />
        </div>
      </div>
    </Layout>
  )
}

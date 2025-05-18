import { useEffect, useState } from 'react'

const OrderConfirmation = () => {
    const [orderDetails, setOrderDetails] = useState<any>(null)

    useEffect(() => {
        const lastOrder = JSON.parse(localStorage.getItem('lastOrder') || 'null')
        setOrderDetails(lastOrder)
    }, [])

    return (
        <div>
            <h2>Order Confirmation</h2>
            {orderDetails ? (
                <>
                    <p>Order ID: {orderDetails.orderId}</p>
                    <ul>
                        {orderDetails.items.map((item: any, index: number) => (
                            <li key={`${item.name}-${index}`}>
                                {item.name} - Quantity: {item.quantity} - Price: ${item.price}
                            </li>
                        ))}
                    </ul>
                    <h3>Total: ${orderDetails.total}</h3>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}

export default OrderConfirmation

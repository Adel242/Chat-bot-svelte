
import { BASE_API_URL } from '$lib/api';

export const fetchUserData = async (apiKey: string) => {
    try {
        const res = await fetch(`${BASE_API_URL}/user`, {
            headers: {
                Authorization: `Bearer ${apiKey}`
            }
        })
        if (!res.ok) {
            return null
        }
        const data = await res.json()
        return data[0]

    } catch (error) {
        console.log('error fetch user', error)
        return null
    }
}
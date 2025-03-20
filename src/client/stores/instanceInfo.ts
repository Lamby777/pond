import { reactive } from 'vue'

export async function fetchInstanceInfo() {
    const res = await fetch(`/api/instance`);

    if (!res.ok) {
        console.error("Failed to fetch instance info: " + res.status);
        return null;
    }

    return await res.json();
}

export default reactive(await fetchInstanceInfo());

import PubSub from "pubsub-js"

export const handleComponentOpen = (component_name: string) => {
    PubSub.publish(component_name)
}
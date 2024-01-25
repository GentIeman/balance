export default defineAppConfig({
    ui: {
        primary: "cyan",
        gray: "slate",
        button: {
            default: {
                size: "sm",
                color: "primary",
                block: true
            },
        },
        formGroup: {
            default: {
                size: "sm"
            }
        },
        container: {
            default: {
                padding: "p-0 sm:p-0 lg:p-0"
            }
        },
        card: {
            default: {
                divide: "divide-y divide-gray-100"
            }
        },
        notification: {
            default: {
                shadow: "shadow"
            }
        },
        divider: {
            default: {
                border: {
                    size: {
                        horizontal: "border-t-2"
                    }
                }
            }
        }
    },
})
import {RouterProvider} from "react-router-dom";
import {router} from "./router/routes.tsx";
import {ConfigProvider, theme} from "antd";
import {useSelector} from "react-redux";
import {getAccessToken, isUserAuthenticated} from "./store/reducers/auth.ts";
import {Suspense} from "react";
import {StompSessionProvider} from "react-stomp-hooks";

function App() {
    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    const accessToken = useSelector(getAccessToken);
    const isAuthenticated = useSelector(isUserAuthenticated)

    const routerUI = (
        <Suspense fallback={<div>Loading...</div>}>
            <ConfigProvider
                theme={{
                    algorithm: theme.defaultAlgorithm,
                    token: {
                        colorPrimary: '#635bff',
                        colorInfo: '#635bff',
                    },
                }}
            >
                <RouterProvider router={router}/>
            </ConfigProvider>
        </Suspense>
    );
    return (
        <>
            {isAuthenticated ? (
                <StompSessionProvider
                    url={socketUrl}
                    connectHeaders={{Authorization: `Bearer ${accessToken}`}}
                    onConnect={() => console.log("✅ STOMP connected")}
                    onDisconnect={() => console.log("❌ STOMP disconnected")}
                >
                    {routerUI}
                </StompSessionProvider>
            ) : (
                routerUI
            )}
        </>
    )
}

export default App

import {useAuth0} from '@auth0/auth0-react';
import {Avatar, Button} from '@material-ui/core';

export function UserInfo() {
    const {isAuthenticated, loginWithRedirect, logout, user} = useAuth0();

    return (
        <>
            {isAuthenticated && <>
                <Avatar src={user.picture} alt={user.name} />
                <Button color="inherit" onClick={() => logout()}>Logout</Button>
            </>}
            {!isAuthenticated && <Button color="inherit" onClick={() => loginWithRedirect()}>Login</Button>}
        </>
    )
}
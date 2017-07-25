import { NavigationActions } from 'react-navigation'

class UtilsService {


    changeRoute(routeName, passedInProperties = null) {
        const navigateAction = NavigationActions.navigate({
            routeName: routeName,
            params: {...passedInProperties},
            action: NavigationActions.navigate({ routeName: routeName})
        })
        this.props.navigation.dispatch(navigateAction)
    }


}

export const utilsService = new UtilsService();

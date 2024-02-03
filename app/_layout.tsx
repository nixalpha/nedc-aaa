import { Drawer } from 'expo-router/drawer';

import { usePathname, useGlobalSearchParams } from "expo-router";

export default function AppLayout() {

  const pathname = usePathname();

  const params = useGlobalSearchParams();

  return (
    <Drawer>
      <Drawer.Screen name="index" options={{drawerItemStyle: {display: 'none'}}} />

      <Drawer.Screen name="home" options={{drawerLabel: 'Home', headerTitle: 'Home' }} />

      <Drawer.Screen name="pastconvs" options={{drawerLabel: 'Saved Conversations', headerTitle: 'Saved Conversations'}} />
    </Drawer>
  );
}

import { Drawer } from 'expo-router/drawer';

export default function AppLayout() {
  return (
    <Drawer>
      <Drawer.Screen name="index" options={{drawerItemStyle: {display: 'none'}}} />

      <Drawer.Screen name="home" options={{drawerLabel: 'Home'}} />

      <Drawer.Screen name="pastconvs" options={{drawerLabel: 'Saved conversations'}} />
    </Drawer>
  );
}

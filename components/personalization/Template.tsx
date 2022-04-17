export default function customComponent() {
  return (
    <div>
      Welcome, copy this component and update anything inside this div. Then
      rename the component to your first + last name without any spaces.
    </div>
  );
}

/**
 * 
 * Add this to the profile/[username].tsx file to use the personalization components
 * 
  let CustomComponent;
  try {
    CustomComponent = dynamic(() =>
      import(`../../components/personalization/${data.name.replace(/\s/g, "")}`)
    );
  } catch (e) {
    CustomComponent = `div`;
  } 
  
  */

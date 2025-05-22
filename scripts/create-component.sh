#!/bin/bash

# Check if component name is provided
if [ -z "$1" ]; then
    echo "Error: Component name is missing."
    echo "Usage: ./create_component.sh <ComponentName>"
    exit 1
fi

component_name="$1"
component_dir="./src/components/$component_name"

# Check if component directory already exists
if [ -d "$component_dir" ]; then
    echo "Error: Component directory already exists."
    exit 1
fi

# Create component directory
mkdir -p "$component_dir"

# Create files
touch "$component_dir/$component_name.tsx"
touch "$component_dir/index.ts"
touch "$component_dir/@types.ts"

# Create styles files
touch "$component_dir/_$component_name.scss"
touch "$component_dir/_index.scss"

# Add basic component template to the TypeScript file
echo "@forward './$component_name'
" > "$component_dir/_index.scss"

# Add basic component template to the TypeScript file
echo "import React from 'react';
import { ${component_name}Props } from './@types';

const ${component_name}: React.FC<${component_name}Props> = () => {
    return (
        <div>
            {/* Your component JSX here */}
        </div>
    );
};

export default ${component_name};
" > "$component_dir/$component_name.tsx"

# Create index.ts file
echo "export { default } from './${component_name}';" > "$component_dir/index.ts"

# Create @types.ts file
echo "export interface ${component_name}Props {
    // Define props here
}" > "$component_dir/@types.ts"

echo "Component '$component_name' created successfully in 'src/components' directory."

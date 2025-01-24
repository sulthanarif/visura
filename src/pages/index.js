// src/pages/index.js

import Button from '@/components/atoms/Button';
import { useRouter } from 'next/router';

function HomePage() {
      const router = useRouter();
      const handleRedirect = () => {
          router.push('/upload-test');
      };
    return (
        
          <div className="container">
              <Button onClick={handleRedirect}>Go To Upload Test Page</Button>
             </div>
        
     )
 }
export default HomePage;
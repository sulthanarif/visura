// src/pages/index.js
import DefaultLayout from '@/components/templates/DefaultLayout';
import Button from '@/components/atoms/Button';
import { useRouter } from 'next/router';

function HomePage() {
      const router = useRouter();
      const handleRedirect = () => {
          router.push('/upload-test');
      };
    return (
        <DefaultLayout>
          <div className="container">
              <Button onClick={handleRedirect}>Go To Upload Test Page</Button>
             </div>
        </DefaultLayout>
     )
 }
export default HomePage;
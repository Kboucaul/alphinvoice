<?php

namespace App\DataFixtures;

use Faker\Factory;
use App\Entity\User;
use App\Entity\Invoice;
use App\Entity\Customer;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\EncoderFactory;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{
    /**
     * Encoder de mot de passe
     *
     * @var [UserPasswordEncoderInterface]
     */
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }
    public function load(ObjectManager $manager)
    {


        //On cree notre faker
        $faker = Factory::create('fr_FR');

        //On crée nos utilisateurs
        for ($u = 0; $u < 5; $u++)
        {
            $chrono = 1;
            $user = new User();
            $hash = $this->encoder->encodePassword($user, 'password');
            $user->setFirstName($faker->firstName)
                ->setLastName($faker->lastName)
                ->setEmail($faker->email)
                ->setpassword($hash);
            $manager->persist($user);
            //On crée nos clients 
            for ($c = 0; $c < mt_rand(5, 20); $c++)
            {
                $customer = new Customer();
                $customer->setFirstName($faker->firstName)
                        ->setLastName($faker->lastName)
                        ->setEmail($faker->email)
                        ->setCompany($faker->company)
                        ->setUser($user);
                $manager->persist($customer);
    
                //On crée des factures pour ce client la
                //donc dans la boucle
                for ($i = 0; $i < mt_rand(1, 3); $i++)
                {
                    $invoice = new Invoice();
                    $invoice->setAmount($faker->randomFloat(2, 250, 5500))
                            ->setSentAt($faker->dateTimeBetween('-6 months'))
                            ->setStatus($faker->randomElement(['envoyée', 'payée', 'annulée']))
                            ->setCustomer($customer)
                            ->setChrono($chrono);
                    $chrono++;
                    $manager->persist($invoice);
                }
            }
        }
        $manager->flush();
    }
}

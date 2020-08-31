<?php

namespace App\Events;

use App\Entity\Customer;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\HttpKernel\Event\KernelEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoder;

class CustomerUserSubscriber implements EventSubscriberInterface {

    private $security;
    public function __construct(Security $security)
    {
        $this->security = $security;
    }
    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setUserForCustomer', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setUserForCustomer(ViewEvent $event)
    {
        $customer = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        //Fait le traitement seulement quand post d'un nouveau customer
        if ($customer instanceof Customer && $method === 'POST')
        {
            //trouver utilisateur actuellemnt connecté
            $user = $this->security->getUser();
            //assigner l'utilisateur au customer que l'on crée
            $customer->setUser($user);
        }
    }
}
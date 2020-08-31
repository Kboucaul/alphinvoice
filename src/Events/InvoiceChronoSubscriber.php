<?php
namespace App\Events;

use DateTime;
use App\Entity\User;
use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class InvoiceChronoSubscriber implements EventSubscriberInterface {

    private $security;
    private $repository;
    public function __construct(Security $security, InvoiceRepository $repository)
    {
        $this->security = $security;
        $this->repository = $repository;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setChronoForInvoice', EventPriorities::PRE_VALIDATE]
        ];
    }
    public function setChronoForInvoice(ViewEvent $event)
    {
        $invoice = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();
        
        if ($invoice instanceof Invoice && $method === "POST")
        {
            //1-Trouver l'utilisateur connecté pour trouver le chrono
            $user = $this->security->getUser();
            //2-Recuperer le repository pour pouvoir recuperer les chronos.
            //=>Invoice repository
            $repository = $this->repository;
            //3-Trouver la derniere facture inserée et son chrono
            $chrono = $repository->findLastChrono($this->security->getUser());
            //4-On donne ainsi le dernier chrono+1
            $invoice->setChrono($chrono + 1);
            //5-On veut mettre la date
            if (empty($invoice->getSentAt()))
            {
                $invoice->setSentAt(new \DateTime());
            }
        }
    }

}
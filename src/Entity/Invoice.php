<?php

namespace App\Entity;

use App\Entity\User;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\InvoiceRepository;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Controller\InvoiceIncrementationController;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints\Choice;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

/*
**  Ici subresource_operations a comme parametre le COMPORTEMENT
**  des invoices quand c'est une SOUS RESOURCES.
**  Ici on lui donne un context de groupe qui permet d'afficher ou non
**  certaines infos.
*/

/**
 * @ORM\Entity(repositoryClass=InvoiceRepository::class)
 * @ApiResource(
 *  subresourceOperations={
 *      "api_customers_invoices_get_subresource"={
 *          "normalization_context"={"groups"={"invoices_subresource"}}
 *      }
 *  },
 * itemOperations={
 *  "GET", "PUT", "DELETE"
 * },
 *  attributes={
 *      "pagination_enabled"=false,
 *      "pagination_items_per_page"=10,
 *      "order": {"amount":"asc"}
 *  },
 *  normalizationContext={
 *      "groups"={"invoices_read"}
 *  }
 * )
 * @ApiFilter(OrderFilter::class, properties={"amount", "sentAt"})
 */
class Invoice
{
    /*
    **  Ici on ajoute le group invoices_subresource,
    **  qui quand l'invoice sera appelé en sous resource
    **  et pas en resource principale alors on affichera ce champ.
    */

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     */
    private $id;

    /*
    **  Ici on ajoute le group invoices_subresource,
    **  qui quand l'invoice sera appelé en sous resource
    **  et pas en resource principale alors on affichera ce champ.
    */

    /**
     * @ORM\Column(type="float")
     * @Groups({"invoices_read", "customers_read"})
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * 
     * @Assert\NotBlank(message="Le montant est obligatoire")
     * @Assert\Type(type="numeric", message="Le montant de la facture doit être un nombre")
     */
    private $amount;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * 
     * @Assert\NotBlank(message="La date d'envoi doit être renseignée")
     */
    private $sentAt;

    /**
     * @ORM\Column(type="string", length=255)
     *@Groups({"invoices_read", "customers_read", "invoices_subresource"})
     *
     *@Assert\NotBlank(message="Le statut de la facture est obligatoire")
     * @Assert\Choice(choices={"envoyée", "payée", "annulée"}, message="Le statut doit être envoyée, payée ou annulée")
     */
    private $status;

    /**
     * @ORM\ManyToOne(targetEntity=Customer::class, inversedBy="invoices")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"invoices_read"})
     * 
     * @Assert\NotBlank(message="Le client doit être renseigné")
     */
    private $customer;

    /**
     * @ORM\Column(type="integer")
     *@Groups({"invoices_read", "customers_read", "invoices_subresource"})
     *
     *@Assert\NotBlank(message="Le chrono doit être renseigné")
     *@Assert\Type(type="integer", message="Le chrono doit être un nombre entier") 
     */
    private $chrono;

    /**
     * Permet de recuperer le user a qui appartient la facture
     *
     * @Groups({"invoices_read", "invoices_subresource"})
     * @return User
     */
    public function getUser(): User
    {
        return $this->customer->getUser();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount(float $amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getSentAt(): ?\DateTimeInterface
    {
        return $this->sentAt;
    }

    public function setSentAt($sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono(int $chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}

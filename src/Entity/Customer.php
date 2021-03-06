<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\CustomerRepository;
use ApiPlatform\Core\Annotation\ApiFilter;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use Symfony\Component\Validator\Constraints as Assert;

/*
**  Dans ApiRessource on peut activer ou desactiver les
**  opération (GET, POST, DELETE, PUT etc...)
**  ==> 
**  collectionOperations={"GET", "POST"},
**  itemOperations={"GET", "PUT", "DELETE"},
**
**  =+> Ici tout est activé (par defaut on peut ne rien mettre)
**
**  On peut aussi changer la route
**  ex : /api/customers => api/clients
**  ==>
**  collectionOperations={"GET"={"path"="/clients"}, "POST"},
**  itemOperations={"GET"={"path"="clients/{id}"}, "PUT", "DELETE"}, 
**
**
** On peut aussi crée des subresources avec un path particulier
**
**  subresourceOperations={
**      "invoices_get_subresource"={"path"="/clients/{id}/factures"}
** },
**
**  Avec ajout de l'annotation @ApiSubresource() au dessus de
**  l'element concerné (ici invoices)
**
*/






/**
 * @ORM\Entity(repositoryClass=CustomerRepository::class)
 * @ApiResource(
 *  collectionOperations={"GET", "POST"},
 *  itemOperations={"GET", "PUT", "DELETE"},
 *  subresourceOperations={
 *      "invoices_get_subresource"={"path"="/customers/{id}/invoices"}
 * },
 *  normalizationContext={
 *      "groups"={"customers_read"}
 *  }
 * )
 * @ApiFilter(SearchFilter::class, properties={
 * "firstName":"start","lastName","company"})
 * @ApiFilter(OrderFilter::class)
 */
class Customer
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"customers_read", "invoices_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"customers_read", "invoices_read"})
     * 
     * @Assert\NotBlank(message="Le prénom du customer est obligatoire")
     * @Assert\Length(min=3, max=255, minMessage="Le prénom doit faire plus de 2 caracteres", maxMessage="Le prénom est trop long", allowEmptyString = true)
     */
    private $firstName;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"customers_read", "invoices_read"})
     * 
     * @Assert\NotBlank(message="Le nom du customer est obligatoire")
     * @Assert\Length(min=3, max=255, minMessage="Le nom doit faire plus de 2 caracteres", maxMessage="Le nom est trop long", allowEmptyString = true)
     */
    private $lastName;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"customers_read", "invoices_read"})
     * 
     * @Assert\NotBlank(message="L'email du customer est obligatoire")
     * @Assert\Email(message="Le format de l'adresse email doit être valide")
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"customers_read", "invoices_read"})
     */
    private $company;

    /**
     * @ORM\OneToMany(targetEntity=Invoice::class, mappedBy="customer")
     * @Groups({"customers_read"})
     * @ApiSubresource()
     */
    private $invoices;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="customers")
     * @Groups({"customers_read"})
     * 
     * @Assert\NotBlank(message="L'utilisateur est obligatoire")
     */
    private $user;

    public function __construct()
    {
        $this->invoices = new ArrayCollection();
    }
    /**
     * Permet de récuperer le total des invoices 
     *@Groups({"customers_read"})
     *
     * @return float
     */
    public function getTotalAmount(): ?float
    {
        return array_reduce($this->invoices->toArray(), function($total, $invoice) {
            return $total + (($invoice->getStatus() === "annulée") ? 0 : $invoice->getAmount());
        }, 0); 
    }

    /**
     * Permet de recuperer le total des invoices qu'il reste a payer
     *@Groups({"customers_read"})

     * @return float
     */
    public function getUnpaidAmount() : ?float
    {
        return (array_reduce($this->invoices->toArray(), function($total, $invoice) {
          return $total + (($invoice->getStatus() === "payée" || $invoice->getStatus() === "annulée") ? 0 : $invoice->getAmount());  
        }));
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getCompany(): ?string
    {
        return $this->company;
    }

    public function setCompany(?string $company): self
    {
        $this->company = $company;

        return $this;
    }

    /**
     * @return Collection|Invoice[]
     */
    public function getInvoices(): Collection
    {
        return $this->invoices;
    }

    public function addInvoice(Invoice $invoice): self
    {
        if (!$this->invoices->contains($invoice)) {
            $this->invoices[] = $invoice;
            $invoice->setCustomer($this);
        }

        return $this;
    }

    public function removeInvoice(Invoice $invoice): self
    {
        if ($this->invoices->contains($invoice)) {
            $this->invoices->removeElement($invoice);
            // set the owning side to null (unless already changed)
            if ($invoice->getCustomer() === $this) {
                $invoice->setCustomer(null);
            }
        }

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }
}

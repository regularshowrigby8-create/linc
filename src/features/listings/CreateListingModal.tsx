import { useState } from 'react';
import type { Workspace } from '@/data/types';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Overlay';
import { Select, Textarea, TextInput } from '@/components/Form';
import { useActions } from '@/state/store';
import { validateListingDescription, validateListingTitle } from '@/utils/validation';

interface CreateListingModalProps {
  open: boolean;
  workspace: Workspace;
  onClose: () => void;
  onCreated?: () => void;
}

const PROMPTS: Record<Workspace, string> = {
  customer: 'What exactly will the customer receive?',
  qualification: 'What are you qualified or prepared to help with?',
  collaboration: 'What must each party agree to before work begins?',
  supply: 'What can be replaced if the first supplier or route is unavailable?',
};

const TITLES: Record<Workspace, string> = {
  customer: 'Create a service listing',
  qualification: 'Create a qualification profile',
  collaboration: 'Create collaboration request',
  supply: 'Create sourcing request',
};

const REACH_OPTIONS = [
  { value: 'local', label: 'Local' },
  { value: 'south_africa_wide', label: 'South Africa-wide' },
  { value: 'international', label: 'International' },
];

const PRICE_MODE_OPTIONS = [
  { value: 'starting_price', label: 'Starting price' },
  { value: 'quote_required', label: 'Quote required' },
  { value: 'price_range', label: 'Price range' },
];

export const CreateListingModal = ({
  open,
  workspace,
  onClose,
  onCreated,
}: CreateListingModalProps) => {
  const actions = useActions();
  const busy = actions.isPending(`create-listing:${workspace}`);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [reach, setReach] = useState('local');
  const [availability, setAvailability] = useState('');
  const [priceMode, setPriceMode] = useState('quote_required');
  const [priceLabel, setPriceLabel] = useState('');
  const [included, setIncluded] = useState('');
  const [excluded, setExcluded] = useState('');
  const [language, setLanguage] = useState('');
  const [serviceCategory, setServiceCategory] = useState('cleaning');
  const [serviceType, setServiceType] = useState('in_person');
  const [qualificationLevel, setQualificationLevel] = useState('Certificate');
  const [opportunityType, setOpportunityType] = useState('contract');
  const [collaborationCategory, setCollaborationCategory] = useState('defined_service');
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [deliveryTarget, setDeliveryTarget] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const reset = () => {
    setTitle('');
    setDescription('');
    setLocation('');
    setAvailability('');
    setPriceLabel('');
    setIncluded('');
    setExcluded('');
    setLanguage('');
    setProduct('');
    setQuantity('1');
    setDeliveryTarget('');
    setErrors({});
  };

  const handleSubmit = async () => {
    const nextErrors: Record<string, string> = {};

    const titleResult = validateListingTitle(title);
    if (!titleResult.ok) nextErrors.title = titleResult.error ?? 'Enter a title.';

    const descriptionResult = validateListingDescription(description);
    if (!descriptionResult.ok) {
      nextErrors.description = descriptionResult.error ?? 'Enter a description.';
    }

    if (workspace !== 'supply' && !location.trim()) {
      nextErrors.location = 'Enter a location, or choose Remote.';
    }
    if (!availability.trim()) nextErrors.availability = 'Enter when you are available.';

    if (priceMode !== 'quote_required' && !priceLabel.trim()) {
      nextErrors.priceLabel = 'Enter the price or price range.';
    }

    if (workspace === 'supply') {
      if (!product.trim()) nextErrors.product = 'Enter the product you need.';
      const parsedQuantity = Number(quantity);
      if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
        nextErrors.quantity = 'Enter a quantity greater than zero.';
      }
      if (!deliveryTarget.trim()) nextErrors.deliveryTarget = 'Enter the delivery target.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const result = await actions.createListing({
      workspace,
      title,
      description,
      location: location.trim() || 'Remote',
      reach: reach as 'local' | 'south_africa_wide' | 'international',
      availability,
      priceMode: priceMode as 'starting_price' | 'quote_required' | 'price_range',
      priceLabel,
      included,
      excluded,
      language: language.trim() || undefined,
      serviceCategory: serviceCategory as never,
      serviceType: serviceType as never,
      qualificationLevel,
      opportunityType: opportunityType as never,
      collaborationCategory: collaborationCategory as never,
      product: product.trim() || undefined,
      quantity: Number(quantity) || 1,
      deliveryTarget: deliveryTarget.trim() || undefined,
    });

    if (result.ok) {
      reset();
      onCreated?.();
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      title={TITLES[workspace]}
      description="Publishing a listing does not create a verification. Listings start as pending review."
      onClose={onClose}
      footer={
        <div className="lh-row lh-spread">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={busy} disabled={busy}>
            Create listing
          </Button>
        </div>
      }
    >
      <div className="lh-stack">
        <TextInput
          label="Title"
          required
          maxLength={80}
          value={title}
          error={errors.title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <Textarea
          label="Description"
          required
          rows={4}
          maxLength={1000}
          value={description}
          error={errors.description}
          hint={PROMPTS[workspace]}
          onChange={(event) => setDescription(event.target.value)}
        />

        {workspace === 'supply' ? (
          <>
            <TextInput
              label="Product"
              required
              value={product}
              error={errors.product}
              onChange={(event) => setProduct(event.target.value)}
            />
            <TextInput
              label="Quantity"
              required
              type="number"
              min={1}
              value={quantity}
              error={errors.quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
            <TextInput
              label="Delivery target"
              required
              value={deliveryTarget}
              error={errors.deliveryTarget}
              onChange={(event) => setDeliveryTarget(event.target.value)}
            />
          </>
        ) : null}

        {workspace === 'customer' ? (
          <>
            <Select
              label="Service category"
              required
              value={serviceCategory}
              onChange={(event) => setServiceCategory(event.target.value)}
              options={[
                { value: 'cleaning', label: 'Cleaning' },
                { value: 'graphic_design', label: 'Graphic design' },
                { value: 'massage_therapy', label: 'Massage therapy' },
                { value: 'translation', label: 'Translation' },
                { value: 'website_development', label: 'Website development' },
                { value: 'home_repair', label: 'Home repair' },
              ]}
            />
            <Select
              label="Service type"
              required
              value={serviceType}
              onChange={(event) => setServiceType(event.target.value)}
              options={[
                { value: 'remote', label: 'Remote' },
                { value: 'in_person', label: 'In person' },
                { value: 'hybrid', label: 'Hybrid' },
              ]}
            />
          </>
        ) : null}

        {workspace === 'qualification' ? (
          <>
            <Select
              label="Qualification level"
              required
              value={qualificationLevel}
              onChange={(event) => setQualificationLevel(event.target.value)}
              options={[
                { value: 'Certificate', label: 'Certificate' },
                { value: 'Diploma', label: 'Diploma' },
                { value: 'Degree', label: 'Degree' },
                { value: 'Registered professional', label: 'Registered professional' },
              ]}
            />
            <Select
              label="Opportunity type"
              required
              value={opportunityType}
              onChange={(event) => setOpportunityType(event.target.value)}
              options={[
                { value: 'employment', label: 'Employment' },
                { value: 'contract', label: 'Contract' },
                { value: 'project', label: 'Project' },
                { value: 'referral', label: 'Referral' },
                { value: 'other', label: 'Other' },
              ]}
            />
          </>
        ) : null}

        {workspace === 'collaboration' ? (
          <Select
            label="Collaboration category"
            required
            value={collaborationCategory}
            onChange={(event) => setCollaborationCategory(event.target.value)}
            options={[
              { value: 'defined_service', label: 'One business providing a service' },
              { value: 'multi_provider', label: 'Multiple providers for one request' },
              { value: 'capacity_request', label: 'Business capacity request' },
              { value: 'joint_project', label: 'Joint project' },
              { value: 'referral_partnership', label: 'Referral partnership' },
              { value: 'shared_premises', label: 'Shared premises or equipment' },
            ]}
          />
        ) : null}

        <TextInput
          label="Location"
          required={workspace !== 'supply'}
          value={location}
          error={errors.location}
          hint="Use Remote when you work online."
          onChange={(event) => setLocation(event.target.value)}
        />

        <Select
          label="Reach"
          required
          value={reach}
          onChange={(event) => setReach(event.target.value)}
          options={REACH_OPTIONS}
        />

        <TextInput
          label="Availability"
          required
          value={availability}
          error={errors.availability}
          onChange={(event) => setAvailability(event.target.value)}
        />

        <Select
          label="Price mode"
          required
          value={priceMode}
          onChange={(event) => setPriceMode(event.target.value)}
          options={PRICE_MODE_OPTIONS}
        />

        {priceMode !== 'quote_required' ? (
          <TextInput
            label="Price"
            required
            value={priceLabel}
            error={errors.priceLabel}
            onChange={(event) => setPriceLabel(event.target.value)}
          />
        ) : null}

        <Textarea
          label="What is included"
          rows={3}
          value={included}
          hint="One item per line. Leave blank to omit this section."
          onChange={(event) => setIncluded(event.target.value)}
        />

        <Textarea
          label="What is not included"
          rows={3}
          value={excluded}
          hint="One item per line. Leave blank to omit this section."
          onChange={(event) => setExcluded(event.target.value)}
        />

        <TextInput
          label="Language"
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
        />

        <p className="lh-caption">
          Experience is optional and is never a requirement unless you state it yourself.
        </p>
      </div>
    </Modal>
  );
};
